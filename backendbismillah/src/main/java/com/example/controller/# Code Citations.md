# Code Citations

## License: unknown
https://github.com/VarelaTechDev/PracticeManyToMany/tree/f2ec35174c76eae0bf64a31c2ac983cded06d563/src/main/java/com/example/practicemanytomany/Controller/CourseController.java

```
.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List
```


## License: unknown
https://github.com/Madhubhashana99/Student-Management-Rest-API-SpringBoot/tree/13cffaf2072cdda4d2ef7d2bd2b3bf305d12112b/studentManagement/src/main/java/com/studentManagement/studentManagement/Controller/CourseController.java

```
"/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course)
```

