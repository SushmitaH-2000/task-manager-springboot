 
package com.example.taskmanager.Controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;





import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173"
})
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Get all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Add a new task
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@RequestBody Task task) {

        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Task title cannot be empty"
            );
        }

        task.setTitle(task.getTitle().trim());
        task.setCompleted(false);

        return taskRepository.save(task);
    }

    // Delete a task
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {

        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Task not found with id: " + id
            );
        }

        taskRepository.deleteById(id);
    }
    
    
    @PatchMapping("/{id}/toggle")
    public Task toggleTask(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Task not found"
            ));

        task.setCompleted(!task.isCompleted());

        return taskRepository.save(task);
    }
}
 