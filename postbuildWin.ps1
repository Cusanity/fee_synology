$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourcePath = Join-Path $scriptPath "src\php"
$destinationPath = Join-Path $scriptPath "docs\php"
$feeWebPath = "Z:\Cusanity\fee_web"

if (!(Test-Path $destinationPath)) {
    mkdir $destinationPath
}
Copy-Item -Path "$sourcePath\*" -Destination $destinationPath -Recurse
Remove-Item "$feeWebPath\*" -Recurse -Force
Copy-Item -Path "$scriptPath\docs\*" -Destination $feeWebPath -Recurse
