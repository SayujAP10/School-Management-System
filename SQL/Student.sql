IF OBJECT_ID(N'dbo.Student', N'U') IS NULL
BEGIN
CREATE Table Student(
    std_id	int identity(1,1) primary key,
	std_f_name	varchar(200),
	std_l_name	varchar(100),
	std_age	Int,
	std_dob	Date,
	std_gender	varchar(10),
	std_email_id	varchar(100),
	std_usr_name	varchar(100),
	std_usr_paswrd	varchar(max),
	std_phno	varchar(100),
	rec_stat	varchar(10),
	crtd_dt	DateTime,
	mfd_dt	DateTime,
)
end