@echo off
set ANT_HOME=ant_lib\apache-ant-1.8.4
set PATH=%PATH%;%ANT_HOME%\bin;

echo start execute ant...
call ant -f build.xml

echo execute end...
pause