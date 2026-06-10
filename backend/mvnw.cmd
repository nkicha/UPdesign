@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.

@echo off
setlocal enabledelayedexpansion

set MAVEN_PROJECTBASEDIR=%~dp0

cd /d "%MAVEN_PROJECTBASEDIR%"

set MAVEN_WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties

if exist "%MAVEN_WRAPPER_PROPERTIES%" (
  for /f "tokens=*" %%i in (%MAVEN_WRAPPER_PROPERTIES%) do set %%i
)

if not defined MAVEN_VERSION (
  set MAVEN_VERSION=3.9.6
)

set MAVEN_HOME=%MAVEN_PROJECTBASEDIR%.mvn\maven
if not exist "%MAVEN_HOME%\bin" (
  echo Downloading Maven %MAVEN_VERSION%...
  mkdir "%MAVEN_HOME%"
  set MAVEN_URL=https://repo1.maven.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip
  
  powershell -Command "try { $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%MAVEN_PROJECTBASEDIR%.mvn\maven.zip' } catch { Write-Error $_ }" 2>&1
  
  if exist "%MAVEN_PROJECTBASEDIR%.mvn\maven.zip" (
    echo Extracting Maven...
    powershell -Command "Expand-Archive -Path '%MAVEN_PROJECTBASEDIR%.mvn\maven.zip' -DestinationPath '%MAVEN_PROJECTBASEDIR%.mvn' -Force"
    powershell -Command "Move-Item -Path '%MAVEN_PROJECTBASEDIR%.mvn\apache-maven-%MAVEN_VERSION%\*' -Destination '%MAVEN_HOME%' -Force"
    powershell -Command "Remove-Item -Path '%MAVEN_PROJECTBASEDIR%.mvn\apache-maven-%MAVEN_VERSION%' -Force"
    del "%MAVEN_PROJECTBASEDIR%.mvn\maven.zip"
  ) else (
    echo Failed to download Maven. Please check your internet connection.
    exit /b 1
  )
)

"%MAVEN_HOME%\bin\mvn.cmd" %*
