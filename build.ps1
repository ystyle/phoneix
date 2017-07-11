rm .\statik\  -recurse -Force
cd app
npm run build
cd ..
cp .\app\dist\index.html .\assets\
go generate
$env:GOOS="windows"
go build
$env:GOOS="linux"
go build

Start-Sleep -Seconds 20