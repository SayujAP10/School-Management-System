using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SchoolManagementSystem.DTO.Request;
using SchoolManagementSystem.DTO.Response;
using SchoolManagementSystem.Interface;
using SchoolManagementSystem.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace SchoolManagementSystem.Services
{
    public class StudentService : IStudentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public StudentService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }


        public async Task<StudentResponseDTO> AddStudent(StudentRequestAddDTO obj)
        {
            var student = new Student
            {
                std_f_name = obj.std_f_name,
                std_l_name = obj.std_l_name,
                std_age = obj.std_age,
                std_dob = obj.std_dob,
                std_gender = obj.std_gender,
                std_email_id = obj.std_email_id,
                std_usr_paswrd = BCrypt.Net.BCrypt.HashPassword(obj.std_usr_paswrd.Trim()),
                std_phno = obj.std_phno,
                rec_stat = "A",
                crtd_dt = DateTime.UtcNow,
                mfd_dt = DateTime.UtcNow,
                Qualifications = new List<Qualification>()
            };
            if (obj.Qualifications != null)
            {
                foreach (var qual in obj.Qualifications)
                {
                    student.Qualifications.Add(new Qualification
                    {
                        course_name = qual.course_name,
                        percentage = qual.percentage,
                        year_of_pass = qual.year_of_pass,
                        rec_stat = "A",
                        crtd_dt = DateTime.UtcNow,
                        mfd_dt = DateTime.UtcNow
                    });
                }
            }

            await _context.Student.AddAsync(student);
            await _context.SaveChangesAsync();

            return new StudentResponseDTO
            {
                std_id = student.std_id
            };
        }

        public Task<IEnumerable<StudentResponseDTO>> GetAllStudents()
        {
            throw new NotImplementedException();
        }

        public async Task<StudentResponseDTO> GetStudentById(long id)
        {
            //var student = await _context.Student.FindAsync(id);
            var student = await _context.Student.Include(s => s.Qualifications).FirstOrDefaultAsync(s => s.std_id == id);
            if (student == null)
            {
                return null;
            }
            return new StudentResponseDTO
            {
                std_id = student.std_id,
                std_f_name = student.std_f_name,
                std_l_name = student.std_l_name,
                std_age = student.std_age,
                std_dob = student.std_dob,
                std_gender = student.std_gender,
                std_email_id = student.std_email_id,
                std_phno = student.std_phno,
                Qualifications = student.Qualifications.Select(q => new Qualification
                {
                    course_name = q.course_name,
                    percentage = q.percentage,
                    year_of_pass = q.year_of_pass
                }).ToList()
            };
        }

        public async Task<LoginResponseDTO> LoginStudent(LoginRequestDTO obj)
        {
            var student = await _context.Student.FirstOrDefaultAsync(s => s.std_email_id == obj.std_email_id);

            if (student != null && BCrypt.Net.BCrypt.Verify(obj.std_usr_paswrd.Trim(), student.std_usr_paswrd.Trim()))
            {
                //JWT tocken generation
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);

                var expiryminutes = _config.GetValue<int>("Jwt:ExpiresMinutes");

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] {
                              new Claim("id", student.std_id.ToString()),
                              new Claim(ClaimTypes.Email, student.std_email_id),
                              new Claim("firstName", student.std_f_name)
                             }),
                    Expires = DateTime.UtcNow.AddMinutes(expiryminutes),
                    SigningCredentials = new SigningCredentials(
                                         new SymmetricSecurityKey(key),
                                         SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _config["Jwt:Issuer"],
                    Audience = _config["Jwt:Audience"]
                };

                // 4. Create and return the token string
                var token = tokenHandler.CreateToken(tokenDescriptor);
                string tockenstr= tokenHandler.WriteToken(token);
                return new LoginResponseDTO
                {
                    std_id = student.std_id,
                    std_f_name = student.std_f_name,
                    Token = tockenstr 
                };
            }
            return null;
        }

     
    }
}
