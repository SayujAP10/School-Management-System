using Microsoft.EntityFrameworkCore;

namespace SchoolManagementSystem
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Models.Student> Student { get; set; }
        public DbSet<Models.Qualification> Qualification { get; set; }
    }
}
