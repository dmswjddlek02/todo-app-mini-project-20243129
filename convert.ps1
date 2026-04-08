Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile('C:\Users\USER_20220505\OneDrive\바탕 화면\todo-app\Reference.gif')
$image.Save('C:\Users\USER_20220505\OneDrive\바탕 화면\todo-app\Reference_frame.png', [System.Drawing.Imaging.ImageFormat]::Png)
$image.Dispose()
