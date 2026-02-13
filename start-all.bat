@echo off
echo Instalando dependencias y ejecutando servidores...

if not exist "node_modules" (
	echo Instalando dependencias de la RAIZ...
	call npm install
) else (
	echo Dependencias de la RAIZ ya instaladas.
)

if not exist "Back\node_modules" (
	echo Instalando dependencias del BACKEND...
	pushd Back
	call npm install
	popd
) else (
	echo Dependencias del BACKEND ya instaladas.
)

if not exist "Front\node_modules" (
	echo Instalando dependencias del FRONTEND...
	pushd Front
	call npm install
	popd
) else (
	echo Dependencias del FRONTEND ya instaladas.
)

echo Levantando servidores...
npx concurrently "npm run startBack --prefix Back" "npm run startFront --prefix Front"

pause
