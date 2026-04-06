using SchoolManagementSystem.DTO.Request;
using SchoolManagementSystem.DTO.Response;

namespace SchoolManagementSystem.Interface
{
    public interface IStudentService
    {
        //get all students
        Task<IEnumerable<StudentResponseDTO>> GetAllStudents();

        //get student by id
        Task<StudentResponseDTO> GetStudentById(long id);

        //add new student
        Task<StudentResponseDTO> AddStudent(StudentRequestAddDTO student);
        Task<LoginResponseDTO> LoginStudent(LoginRequestDTO obj);


    }
}
