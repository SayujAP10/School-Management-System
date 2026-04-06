IF OBJECT_ID(N'dbo.Qualification', N'U') IS NULL
BEGIN
CREATE Table Qualification(
		qual_id	 int identity(1,1) primary key,
		std_id	bigint,
		course_name	varchar(500),
		percentage	varchar(100),
		year_of_pass	varchar(100),
		rec_stat	varchar(10),
		crtd_dt	DateTime,
		mfd_dt	DateTime

	CONSTRAINT FK_Student_Qualifications FOREIGN KEY (std_id) 
    REFERENCES Student(std_id) ON DELETE CASCADE
)
end