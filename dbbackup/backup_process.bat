REM @echo off
if "%1"=="backup" goto backup
:backup
set pathvalue=%AQA_HOME%\
%AQA_HOME%\mysql\bin\mysqldump -h %2 -u %3 -p%4 %5 > %6
goto end

:end
