' WMI query to list all properties and values of the Win32_Processor class
' This VBScript code was generated using the WMI Code Generator, Version 2.01
' http://www.robvanderwoude.com/wmigen.html

On Error Resume Next

Const wbemFlagReturnImmediately = &h10
Const wbemFlagForwardOnly       = &h20

If WScript.Arguments.UnNamed.Count = 1 Then
	strComputer = WScript.Arguments.UnNamed(1)
Else
	strComputer = "."
End If

Set objWMIService = GetObject( "winmgmts://" & strComputer & "/root/CIMV2" )
Set cpuInstances = objWMIService.ExecQuery( "SELECT * FROM Win32_Processor", "WQL", wbemFlagReturnImmediately + wbemFlagForwardOnly )
Set biosInstances = objWMIService.ExecQuery( "SELECT * FROM Win32_BIOS", "WQL", wbemFlagReturnImmediately + wbemFlagForwardOnly )
Set boardInstances = objWMIService.ExecQuery( "SELECT * FROM Win32_BaseBoard", "WQL", wbemFlagReturnImmediately + wbemFlagForwardOnly )
Set vdoInstances = objWMIService.ExecQuery( "SELECT * FROM Win32_VideoController", "WQL", wbemFlagReturnImmediately + wbemFlagForwardOnly )
Set nwInstances = objWMIService.ExecQuery( "SELECT * FROM Win32_NetworkAdapterConfiguration", "WQL", wbemFlagReturnImmediately + wbemFlagForwardOnly )

Set strRetVal = ""

For Each cpuInstance In cpuInstances
	strRetVal = cpuInstance.UniqueId
	If IsEmpty(strRetVal) Or IsNull(strRetVal) Then
		strRetVal = cpuInstance.ProcessorId
		If IsEmpty(strRetVal) Or IsNull(strRetVal) Then
			strRetVal = cpuInstance.Name
			If IsEmpty(strRetVal) Or IsNull(strRetVal) Then
				strRetVal = cpuInstance.Manufacturer
			End If	
		End If
	End If
	strRetVal = strRetVal & cpuInstance.MaxClockSpeed
Next

For Each biosInstance In biosInstances
	strRetVal = strRetVal & biosInstance.Manufacturer
	strRetVal = strRetVal & biosInstance.SMBIOSBIOSVersion
	strRetVal = strRetVal & biosInstance.IdentificationCode
	strRetVal = strRetVal & biosInstance.SerialNumber
	strRetVal = strRetVal & biosInstance.ReleaseDate
	strRetVal = strRetVal & biosInstance.Version	
Next

For Each boardInstance In boardInstances
	strRetVal = strRetVal & boardInstance.Model
	strRetVal = strRetVal & boardInstance.Manufacturer
	strRetVal = strRetVal & boardInstance.Name
	strRetVal = strRetVal & boardInstance.SerialNumber
Next

For Each vdoInstance In vdoInstances
'	strRetVal = strRetVal & vdoInstance.DriverVersion
	strRetVal = strRetVal & vdoInstance.VideoProcessor
	strRetVal = strRetVal & vdoInstance.Name
Next

'For Each nwInstance In nwInstances
'	strRetVal = strRetVal & nwInstance.MACAddress
'	strRetVal = strRetVal & nwInstance.IPEnabled
'Next


WScript.Echo strRetVal
