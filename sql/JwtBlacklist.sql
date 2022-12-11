use <place your database name here>;
create table JwtBlacklist
(
	Id int not null auto_increment,
    UserId varchar(50) not null,
    MinimumIat datetime not null,
    constraint PKC_JwtBlacklist primary key (Id),
    constraint UX_JwtBlacklist_UserId unique (UserId)
);
