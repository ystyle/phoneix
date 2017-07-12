rm .\statik\  -recurse -Force
cd app
npm run build
cd ..
cp .\app\dist\index.html .\assets\
go generate

$env:GOOS="windows"
go build -o phoneix-windows.exe

$env:GOOS="linux"
go build -o phoneix-linux

$env:GOOS="darwin"
go build -o phoneix-darwin


echo "done!"
Start-Sleep -Seconds 20