@ECHO OFF
SET header=header.cj
SET display=no
IF "%2"=="/d" SET display=display
REM generates a bunch of ckevin files
node split.js %1
jconsole gen.ijs
FOR /f "tokens=* usebackq" %%F IN (`dir /s /b *.ckevin`) DO CALL :compile "%%F"
GOTO EOF
:compile "path"
    SET fn=%~n1
    TYPE %header% > %fn%.java
    ECHO.>>%fn%.java
    ECHO.#define T %fn%>>%fn%.java
    ECHO.#define TT "%fn%">>%fn%.java
    TYPE "%~1">>%fn%.java
    cpp %fn%.java | ruby -ne "print$_ if$_[0]!=?#&&$_[1]" | python balance.py > temp.txt
    TYPE temp.txt > %fn%.java
    IF "%display%"=="display" TYPE temp.txt
    javac %fn%.java
    DEL temp.txt
    @ECHO OFF
    EXIT /B
:EOF
java %~n1
DEL *.ckevin *.java *.class