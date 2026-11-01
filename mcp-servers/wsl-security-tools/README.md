# WSL Security Tools MCP Server

Professional MCP server exposing WSL Kali Linux security tools to OpenCode.

## Overview

This MCP server provides direct access to 20+ professional security tools installed in WSL Kali Linux, enabling seamless pentesting workflows from OpenCode without manual command execution.

## Tools Exposed

### Reconnaissance Tools
- **nuclei-scan** - Vulnerability scanner with 13,722+ templates
- **subfinder** - Passive subdomain enumeration
- **httpx** - Fast HTTP probing and tech detection
- **katana** - Next-gen web crawler and spider
- **ffuf** - Fast web fuzzer for content discovery
- **whatweb** - Technology fingerprinting

### Exploitation Tools
- **sqlmap** - Automatic SQL injection exploitation
- **nmap** - Network port scanner and security auditing

### Active Directory Tools
- **bloodhound** - AD attack path analysis
- **crackmapexec** - Swiss army knife for network pentesting
- **evil-winrm** - Ultimate WinRM shell

### Utility Tools
- **chisel** - TCP/UDP tunnel for pivoting

## Installation

Already installed via OpenCode config at:
```
C:\Users\YourUser\.config\opencode\opencode.jsonc
```

MCP server registered as:
```json
"wsl-security-tools": {
  "type": "local",
  "command": ["node", "C:\\Users\\YourUser\\.config\\opencode\\mcp-servers\\wsl-security-tools\\index.js"],
  "enabled": true
}
```

## Usage Examples

### Reconnaissance

**Subdomain Enumeration:**
```
Use subfinder to find subdomains of target.com
```

**HTTP Probing:**
```
Use httpx to probe www.target.com for status code, title, and technologies
```

**Content Discovery:**
```
Use ffuf to fuzz https://target.com/FUZZ with common wordlist
```

**Vulnerability Scanning:**
```
Use nuclei-scan on https://target.com for high and critical vulnerabilities
```

### Web Application Testing

**Crawling:**
```
Use katana to crawl https://target.com with depth 3 and extract forms
```

**SQL Injection:**
```
Use sqlmap to test https://target.com/page?id=1 for SQL injection with level 3
```

### Network Testing

**Port Scanning:**
```
Use nmap to do a quick scan on 192.168.1.1
```

**Service Enumeration:**
```
Use nmap to do version detection scan on 10.0.0.5 ports 80,443,8080
```

### Active Directory

**BloodHound Collection:**
```
Use bloodhound to collect AD data from domain.local with username admin, password Pass123, DC IP 10.0.0.10
```

**CME Enumeration:**
```
Use crackmapexec SMB protocol on 192.168.1.0/24 with username admin, password Pass123, enumerate shares
```

**WinRM Shell:**
```
Use evil-winrm to connect to 10.0.0.50 as administrator with password Admin123 and execute whoami command
```

### Pivoting

**Chisel Server:**
```
Use chisel in server mode on port 8080 with reverse tunneling enabled
```

**Chisel Client:**
```
Use chisel in client mode to connect to 10.0.0.5:8080 with R:socks remote
```

## Tool Parameters

### nuclei-scan

```json
{
  "target": "https://target.com",
  "severity": "medium",
  "tags": "cve,exposure,misconfig",
  "templates": "",
  "rateLimit": 150,
  "timeout": 120
}
```

### subfinder

```json
{
  "domain": "target.com",
  "silent": true,
  "recursive": false,
  "timeout": 60
}
```

### httpx

```json
{
  "targets": "target.com,www.target.com",
  "statusCode": true,
  "title": true,
  "techDetect": true,
  "webServer": false,
  "followRedirects": true,
  "timeout": 60
}
```

### katana

```json
{
  "url": "https://target.com",
  "depth": 3,
  "headers": "Cookie: session=xxx",
  "jsAnalysis": false,
  "formExtraction": true,
  "scope": "",
  "timeout": 120
}
```

### ffuf

```json
{
  "url": "https://target.com/FUZZ",
  "wordlist": "common",
  "matchCodes": "200,301,302,403",
  "filterSize": "",
  "threads": 40,
  "maxTime": 300,
  "timeout": 360
}
```

Available wordlists:
- `common` - Common paths (default)
- `api` - API endpoints
- `admin` - Admin panels
- `backup` - Backup files
- `raft-small` - RAFT small wordlist
- `raft-medium` - RAFT medium wordlist
- `raft-large` - RAFT large wordlist

### sqlmap

```json
{
  "url": "https://target.com/page?id=1",
  "data": "username=admin&password=test",
  "cookie": "session=xxx",
  "level": 1,
  "risk": 1,
  "dbs": false,
  "tables": false,
  "dump": false,
  "batch": true,
  "timeout": 300
}
```

### nmap

```json
{
  "target": "192.168.1.1",
  "scanType": "quick",
  "ports": "80,443,8080",
  "scripts": "vuln",
  "serviceDetection": true,
  "osDetection": false,
  "timeout": 300
}
```

Scan types:
- `quick` - Fast scan of common ports
- `full` - All 65535 ports
- `udp` - UDP scan
- `stealth` - Stealth SYN scan
- `version` - Service version detection
- `vuln` - Vulnerability scan with NSE scripts

### bloodhound

```json
{
  "domain": "domain.local",
  "username": "admin",
  "password": "Pass123",
  "dcIp": "10.0.0.10",
  "collectionMethod": "all",
  "outputDir": "",
  "timeout": 600
}
```

Collection methods:
- `all` - Collect everything
- `dconly` - DC only
- `group` - Group membership
- `localadmin` - Local admins
- `session` - Sessions
- `trusts` - Trusts
- `loggedon` - Logged on users

### crackmapexec

```json
{
  "protocol": "smb",
  "target": "192.168.1.0/24",
  "username": "admin",
  "password": "Pass123",
  "hash": "",
  "shares": true,
  "users": false,
  "groups": false,
  "command": "",
  "timeout": 180
}
```

Protocols:
- `smb` - SMB/CIFS
- `winrm` - WinRM
- `ssh` - SSH
- `ldap` - LDAP
- `mssql` - MSSQL
- `rdp` - RDP

### evil-winrm

```json
{
  "ip": "10.0.0.50",
  "username": "administrator",
  "password": "Admin123",
  "hash": "",
  "command": "whoami",
  "scriptFile": "",
  "timeout": 60
}
```

### whatweb

```json
{
  "url": "https://target.com",
  "aggression": 3,
  "verbose": true,
  "timeout": 60
}
```

### chisel

```json
{
  "mode": "server",
  "serverHost": "",
  "port": 8080,
  "reverse": true,
  "remotes": ""
}
```

## Output Format

All tools return JSON with:

```json
{
  "tool": "tool-name",
  "success": true/false,
  "output": "command output",
  "error": "error message if any",
  "arguments": { ... }
}
```

## Security Notes

- All tools run in WSL Kali Linux isolated environment
- Credentials are passed via environment (not logged)
- Tools respect configured timeouts
- Output is sanitized and structured
- Use responsibly and only on authorized targets

## Troubleshooting

**Tools not found:**
- Check WSL Kali is running: `wsl -d kali-linux -- bash -c "which nuclei"`
- Verify paths: Tools are in `/home/youruser/go/bin/` and system PATH

**Timeout errors:**
- Increase timeout parameter
- Check network connectivity
- Verify target is accessible

**Permission errors:**
- Some tools require sudo (nmap, responder)
- Run OpenCode with appropriate permissions

## Tool Paths

All tools are installed at:

```
Go tools:     /home/youruser/go/bin/
APT tools:    /usr/bin/
Custom tools: /home/youruser/.local/bin/
Wordlists:    /usr/share/seclists/
```

## Development

To add new tools:

1. Add tool definition to `TOOLS` object
2. Implement handler in `TOOL_HANDLERS`
3. Test with: `node index.js`
4. Restart OpenCode to reload

## License

MIT - Professional Security Tools Integration

## Author

YaTal Security - Red Team Infrastructure
