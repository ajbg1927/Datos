@echo off
echo Creando entorno virtual...
python -m venv venv

echo Activando entorno virtual...
call venv\Scripts\activate.bat

echo Instalando dependencias...
pip install -r requirements.txt

echo Backend listo. Puedes iniciar con:
echo venv\Scripts\activate && flask run
pause