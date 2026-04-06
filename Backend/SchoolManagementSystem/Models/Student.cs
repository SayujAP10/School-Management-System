using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementSystem.Models
{
    public class Student
    {
        [Key]
        public long std_id { get; set; }
        [Required]
        public string std_f_name { get; set; } = string.Empty;
        public string std_l_name { get; set; } = string.Empty;
        [Required]
        public int std_age { get; set; }
        [Required]
        public DateTime std_dob { get; set; }
        [Required]
        public string std_gender { get; set; } = string.Empty;
        [Required]
        public string std_email_id { get; set; } = string.Empty;
        [Required]
        public string std_usr_paswrd { get; set; } = string.Empty;
        [Required]
        public string std_phno { get; set; } = string.Empty;
        public string rec_stat { get; set; } = string.Empty;
        public DateTime crtd_dt { get; set; }
        public DateTime mfd_dt { get; set; }

        public List<Qualification> Qualifications { get; set; } = new List<Qualification>();
    }

    public class Qualification
    {
        [Key]
        public long qual_id { get; set; }
        public long std_id { get; set; }
        [ForeignKey("std_id")] // <--- This tells EF: "Use std_id, don't invent a new column!"
        public Student ? Student { get; set; }
        public string course_name { get; set; } = string.Empty;
        public string percentage { get; set; } 
        public string year_of_pass { get; set; } = string.Empty;
        public string rec_stat { get; set; } = string.Empty;
        public DateTime crtd_dt { get; set; }
        public DateTime mfd_dt { get; set; }
    }
}
