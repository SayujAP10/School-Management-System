using SchoolManagementSystem.Models;

namespace SchoolManagementSystem.DTO.Response
{
    public class StudentResponseDTO
    {
        public long std_id { get; set; }
        public string std_f_name { get; set; } = string.Empty;
        public string std_l_name { get; set; } = string.Empty;
        public int std_age { get; set; }
        public DateTime std_dob { get; set; }
        public string std_gender { get; set; } = string.Empty;
        public string std_email_id { get; set; } = string.Empty;
        public string std_usr_paswrd { get; set; } = string.Empty;
        public string std_phno { get; set; } = string.Empty;
        public List<Qualification> Qualifications { get; set; } = new List<Qualification>();
    }
}
