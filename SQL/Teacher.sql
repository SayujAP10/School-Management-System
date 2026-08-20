-- =============================================
-- Table: Teacher
-- Description: Table schema for storing Teacher details
-- =============================================
IF OBJECT_ID(N'dbo.Teacher', N'U') IS NULL
BEGIN
CREATE TABLE Teacher (
    tch_id                 INT IDENTITY(1,1) PRIMARY KEY,
    tch_f_name             VARCHAR(200) NOT NULL,
    tch_l_name             VARCHAR(100) NULL,
    tch_gender             VARCHAR(10) NULL,
    tch_dob                DATE NULL,
    tch_email_id           VARCHAR(100) NOT NULL UNIQUE,
    tch_usr_paswrd         VARCHAR(MAX) NOT NULL,
    tch_phno               VARCHAR(100) NULL,
    tch_department         VARCHAR(100) NULL,
    tch_subject_spec       VARCHAR(100) NULL,
    tch_qualification      VARCHAR(100) NULL,
    tch_experience_yrs     INT DEFAULT 0,
    rec_stat               VARCHAR(10) DEFAULT 'A',
    crtd_dt                DATETIME DEFAULT GETUTCDATE(),
    mfd_dt                 DATETIME DEFAULT GETUTCDATE()
);
END
GO

-- =============================================
-- Stored Procedure: sp_InsertTeacher
-- =============================================
IF OBJECT_ID(N'dbo.sp_InsertTeacher', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_InsertTeacher;
GO

CREATE PROCEDURE dbo.sp_InsertTeacher
    @tch_f_name          VARCHAR(200),
    @tch_l_name          VARCHAR(100),
    @tch_gender          VARCHAR(10),
    @tch_dob             DATE,
    @tch_email_id        VARCHAR(100),
    @tch_usr_paswrd      VARCHAR(MAX),
    @tch_phno            VARCHAR(100),
    @tch_department      VARCHAR(100),
    @tch_subject_spec    VARCHAR(100),
    @tch_qualification   VARCHAR(100),
    @tch_experience_yrs  INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Teacher (
        tch_f_name, tch_l_name, tch_gender, tch_dob, tch_email_id,
        tch_usr_paswrd, tch_phno, tch_department, tch_subject_spec,
        tch_qualification, tch_experience_yrs, rec_stat, crtd_dt, mfd_dt
    )
    VALUES (
        @tch_f_name, @tch_l_name, @tch_gender, @tch_dob, @tch_email_id,
        @tch_usr_paswrd, @tch_phno, @tch_department, @tch_subject_spec,
        @tch_qualification, @tch_experience_yrs, 'A', GETUTCDATE(), GETUTCDATE()
    );

    SELECT SCOPE_IDENTITY() AS tch_id;
END
GO

-- =============================================
-- Stored Procedure: sp_GetTeacherById
-- =============================================
IF OBJECT_ID(N'dbo.sp_GetTeacherById', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetTeacherById;
GO

CREATE PROCEDURE dbo.sp_GetTeacherById
    @tch_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        tch_id, tch_f_name, tch_l_name, tch_gender, tch_dob, 
        tch_email_id, tch_phno, tch_department, tch_subject_spec, 
        tch_qualification, tch_experience_yrs, rec_stat, crtd_dt, mfd_dt
    FROM Teacher
    WHERE tch_id = @tch_id AND rec_stat = 'A';
END
GO

-- =============================================
-- Stored Procedure: sp_GetAllTeachers
-- =============================================
IF OBJECT_ID(N'dbo.sp_GetAllTeachers', N'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetAllTeachers;
GO

CREATE PROCEDURE dbo.sp_GetAllTeachers
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        tch_id, tch_f_name, tch_l_name, tch_gender, tch_dob, 
        tch_email_id, tch_phno, tch_department, tch_subject_spec, 
        tch_qualification, tch_experience_yrs, rec_stat, crtd_dt, mfd_dt
    FROM Teacher
    WHERE rec_stat = 'A'
    ORDER BY tch_f_name ASC;
END
GO
