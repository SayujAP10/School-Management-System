IF OBJECT_ID(N'dbo.Attendence', N'U') IS NULL
BEGIN
CREATE Table Attendence(
    atds_id bigint identity(1,1) primary key,
    std_id	bigint,
	atds_date	DateTime,
	atds_stat	varchar(100),
	rec_stat	varchar(10),
	crtd_dt	DateTime,
	mfd_dt	DateTime,
)
end