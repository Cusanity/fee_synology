mkdir ./docs/php
Copy-Item -Path "C:\Users\wyc93\Desktop\fun_code\vue3-demo\src\php" -Destination "C:\Users\wyc93\Desktop\fun_code\vue3-demo\docs\php" -Recurse
Remove-Item "Z:\Cusanity\fee_web\*" -Recurse -Force
Copy-Item -Path "C:\Users\wyc93\Desktop\fun_code\vue3-demo\docs\*" -Destination "Z:\Cusanity\fee_web" -Recurse
