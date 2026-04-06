using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.DTO.Request;
using SchoolManagementSystem.Interface;

namespace SchoolManagementSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;
        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [AllowAnonymous]
        //insert new student
        [HttpPost("Insert")]
        public async Task<IActionResult> AddStudent(StudentRequestAddDTO obj)
        {
            var result = await _studentService.AddStudent(obj);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest("Failed to add student.");
            }
        }

        [AllowAnonymous]
        //Login student
        [HttpPost("Login")]
        public async Task<IActionResult> LoginStudent(LoginRequestDTO obj)
        {
            var result = await _studentService.LoginStudent(obj);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return Unauthorized("Invalid email or password.");
            }
        }

        //Get student by id
        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetStudentById(long id)
        {
            var result = await _studentService.GetStudentById(id);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return NotFound("Student not found.");
            }
        }
    }
}
