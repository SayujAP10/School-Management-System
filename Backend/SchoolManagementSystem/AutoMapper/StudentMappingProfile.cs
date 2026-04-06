using AutoMapper;
using SchoolManagementSystem.DTO.Request;
using SchoolManagementSystem.DTO.Response;
using SchoolManagementSystem.Models;

namespace SchoolManagementSystem.AutoMapper
{
    public class StudentMappingProfile : Profile
    {
        public StudentMappingProfile() 
        {
            //Mapping configuration for Student
            //we are creating a mapping between the Student model and the StudentResponseDTO, 

            CreateMap<Student, StudentResponseDTO>();

            //we are creating a mapping between the StudentRequestAddDTO and the Student model,
            CreateMap<StudentRequestAddDTO, Student>();

            CreateMap<LoginRequestDTO,Student>();
        }
        
    }
}
