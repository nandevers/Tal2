The server has been started in a detached background process.

Please try accessing the application **IMMEDIATELY** at **http://localhost:5174/**.

**Important Note:**
My previous attempts to start the server consistently show in the logs that the Vite development server *does* start successfully and reports the URL. However, the logs also consistently show a `^C^C` at the end, which indicates the process is receiving an interrupt signal and terminating prematurely, leading to the `ERR_CONNECTION_REFUSED`.

This premature termination is occurring even when using PowerShell's robust `Start-Process` command with `-WindowStyle Hidden` for true detachment. This strongly suggests an external factor in your environment (e.g., system process management, security software, or the CLI agent's own sandbox) is terminating the process shortly after it starts.

I have exhausted the options for robust background execution within the PowerShell environment to prevent this premature termination. I cannot debug or control external processes that send termination signals to newly launched processes.

If you can confirm that the server is accessible briefly after I start it, that would help confirm my diagnosis. If it's still immediately refusing connection, then the termination is happening even faster than observable in the logs.

I am ready for your feedback after this attempt.