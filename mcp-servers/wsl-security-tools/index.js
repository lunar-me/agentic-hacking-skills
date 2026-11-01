#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// WSL execution helper
async function execWSL(command, timeout = 120000) {
  const wslCommand = `wsl -d kali-linux -- bash -c "${command.replace(/"/g, '\\"')}"`;
  try {
    const { stdout, stderr } = await execAsync(wslCommand, { 
      timeout,
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    return { success: true, output: stdout, error: stderr };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || "", 
      error: error.stderr || error.message 
    };
  }
}

// Tool definitions
const TOOLS = {
  // === RECONNAISSANCE TOOLS ===
  
  "nuclei-scan": {
    description: "Run Nuclei vulnerability scanner with 13,722+ templates",
    inputSchema: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description: "Target URL or domain to scan"
        },
        severity: {
          type: "string",
          enum: ["info", "low", "medium", "high", "critical"],
          description: "Minimum severity level (default: medium)",
          default: "medium"
        },
        tags: {
          type: "string",
          description: "Comma-separated tags to filter templates (e.g., 'cve,exposure,misconfig')"
        },
        templates: {
          type: "string",
          description: "Specific template path or name"
        },
        rateLimit: {
          type: "number",
          description: "Maximum requests per second (default: 150)",
          default: 150
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 120)",
          default: 120
        }
      },
      required: ["target"]
    }
  },

  "subfinder": {
    description: "Passive subdomain enumeration tool",
    inputSchema: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          description: "Target domain to enumerate subdomains"
        },
        silent: {
          type: "boolean",
          description: "Show only subdomains in output",
          default: true
        },
        recursive: {
          type: "boolean",
          description: "Use recursive subdomain enumeration",
          default: false
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 60)",
          default: 60
        }
      },
      required: ["domain"]
    }
  },

  "httpx": {
    description: "Fast HTTP toolkit for probing web servers",
    inputSchema: {
      type: "object",
      properties: {
        targets: {
          type: "string",
          description: "Target URL(s) or domain(s), comma-separated or newline-separated"
        },
        statusCode: {
          type: "boolean",
          description: "Display HTTP status code",
          default: true
        },
        title: {
          type: "boolean",
          description: "Display page title",
          default: true
        },
        techDetect: {
          type: "boolean",
          description: "Display detected technologies",
          default: true
        },
        webServer: {
          type: "boolean",
          description: "Display web server name",
          default: false
        },
        followRedirects: {
          type: "boolean",
          description: "Follow HTTP redirects",
          default: true
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 60)",
          default: 60
        }
      },
      required: ["targets"]
    }
  },

  "katana": {
    description: "Next-generation crawling and spidering framework",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Target URL to crawl"
        },
        depth: {
          type: "number",
          description: "Maximum crawl depth (default: 3)",
          default: 3
        },
        headers: {
          type: "string",
          description: "Custom headers (format: 'Cookie: session=xxx')"
        },
        jsAnalysis: {
          type: "boolean",
          description: "Enable JavaScript file analysis",
          default: false
        },
        formExtraction: {
          type: "boolean",
          description: "Extract form fields",
          default: true
        },
        scope: {
          type: "string",
          description: "Crawling scope regex pattern"
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 120)",
          default: 120
        }
      },
      required: ["url"]
    }
  },

  "ffuf": {
    description: "Fast web fuzzer for content discovery",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Target URL with FUZZ keyword (e.g., https://target.com/FUZZ)"
        },
        wordlist: {
          type: "string",
          enum: [
            "common",
            "api",
            "admin",
            "backup",
            "raft-small",
            "raft-medium",
            "raft-large"
          ],
          description: "Wordlist to use (from SecLists)",
          default: "common"
        },
        matchCodes: {
          type: "string",
          description: "Match HTTP status codes (e.g., '200,301,302,403')",
          default: "200,301,302,403"
        },
        filterSize: {
          type: "string",
          description: "Filter response sizes (e.g., '1234,5678')"
        },
        threads: {
          type: "number",
          description: "Number of concurrent threads (default: 40)",
          default: 40
        },
        maxTime: {
          type: "number",
          description: "Maximum running time in seconds (default: 300)",
          default: 300
        },
        timeout: {
          type: "number",
          description: "Overall timeout in seconds (default: 360)",
          default: 360
        }
      },
      required: ["url"]
    }
  },

  // === EXPLOITATION TOOLS ===

  "sqlmap": {
    description: "Automatic SQL injection and database takeover tool",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Target URL with parameter (e.g., https://target.com/page?id=1)"
        },
        data: {
          type: "string",
          description: "POST data (e.g., 'username=admin&password=test')"
        },
        cookie: {
          type: "string",
          description: "HTTP Cookie header value"
        },
        level: {
          type: "number",
          enum: [1, 2, 3, 4, 5],
          description: "Level of tests (1-5, default: 1)",
          default: 1
        },
        risk: {
          type: "number",
          enum: [1, 2, 3],
          description: "Risk of tests (1-3, default: 1)",
          default: 1
        },
        dbs: {
          type: "boolean",
          description: "Enumerate databases",
          default: false
        },
        tables: {
          type: "boolean",
          description: "Enumerate tables",
          default: false
        },
        dump: {
          type: "boolean",
          description: "Dump database table entries",
          default: false
        },
        batch: {
          type: "boolean",
          description: "Never ask for user input (batch mode)",
          default: true
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 300)",
          default: 300
        }
      },
      required: ["url"]
    }
  },

  "nmap": {
    description: "Network port scanner and security auditing tool",
    inputSchema: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description: "Target IP, hostname, or CIDR range"
        },
        scanType: {
          type: "string",
          enum: ["quick", "full", "udp", "stealth", "version", "vuln"],
          description: "Scan type preset",
          default: "quick"
        },
        ports: {
          type: "string",
          description: "Port specification (e.g., '80,443,8080' or '1-1000')"
        },
        scripts: {
          type: "string",
          description: "NSE scripts to run (e.g., 'vuln,exploit')"
        },
        serviceDetection: {
          type: "boolean",
          description: "Enable service/version detection",
          default: true
        },
        osDetection: {
          type: "boolean",
          description: "Enable OS detection",
          default: false
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 300)",
          default: 300
        }
      },
      required: ["target"]
    }
  },

  // === ACTIVE DIRECTORY TOOLS ===

  "bloodhound": {
    description: "Active Directory attack path analysis (Python collector)",
    inputSchema: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          description: "Target Active Directory domain"
        },
        username: {
          type: "string",
          description: "Domain username"
        },
        password: {
          type: "string",
          description: "Domain password"
        },
        dcIp: {
          type: "string",
          description: "Domain Controller IP address"
        },
        collectionMethod: {
          type: "string",
          enum: ["all", "dconly", "group", "localadmin", "session", "trusts", "loggedon"],
          description: "Collection method",
          default: "all"
        },
        outputDir: {
          type: "string",
          description: "Output directory for JSON files (default: current dir)"
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 600)",
          default: 600
        }
      },
      required: ["domain", "username", "password", "dcIp"]
    }
  },

  "crackmapexec": {
    description: "Swiss army knife for pentesting networks (CME)",
    inputSchema: {
      type: "object",
      properties: {
        protocol: {
          type: "string",
          enum: ["smb", "winrm", "ssh", "ldap", "mssql", "rdp"],
          description: "Protocol to use",
          default: "smb"
        },
        target: {
          type: "string",
          description: "Target IP, hostname, or CIDR range"
        },
        username: {
          type: "string",
          description: "Username or username file"
        },
        password: {
          type: "string",
          description: "Password or password file"
        },
        hash: {
          type: "string",
          description: "NTLM hash for pass-the-hash"
        },
        shares: {
          type: "boolean",
          description: "Enumerate shares",
          default: false
        },
        users: {
          type: "boolean",
          description: "Enumerate users",
          default: false
        },
        groups: {
          type: "boolean",
          description: "Enumerate groups",
          default: false
        },
        command: {
          type: "string",
          description: "Execute command on target"
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 180)",
          default: 180
        }
      },
      required: ["target", "username", "password"]
    }
  },

  "evil-winrm": {
    description: "Ultimate WinRM shell for hacking/pentesting",
    inputSchema: {
      type: "object",
      properties: {
        ip: {
          type: "string",
          description: "Target IP address"
        },
        username: {
          type: "string",
          description: "Username"
        },
        password: {
          type: "string",
          description: "Password"
        },
        hash: {
          type: "string",
          description: "NTLM hash for pass-the-hash"
        },
        command: {
          type: "string",
          description: "Command to execute (non-interactive mode)"
        },
        scriptFile: {
          type: "string",
          description: "PowerShell script to execute"
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 60)",
          default: 60
        }
      },
      required: ["ip", "username"]
    }
  },

  // === UTILITY TOOLS ===

  "whatweb": {
    description: "Web scanner for technology fingerprinting",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Target URL"
        },
        aggression: {
          type: "number",
          enum: [1, 2, 3, 4],
          description: "Aggression level (1=passive, 4=aggressive, default: 3)",
          default: 3
        },
        verbose: {
          type: "boolean",
          description: "Verbose output",
          default: true
        },
        timeout: {
          type: "number",
          description: "Timeout in seconds (default: 60)",
          default: 60
        }
      },
      required: ["url"]
    }
  },

  "chisel": {
    description: "Fast TCP/UDP tunnel over HTTP for pivoting",
    inputSchema: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["server", "client"],
          description: "Run as server or client"
        },
        serverHost: {
          type: "string",
          description: "Server host (client mode only)"
        },
        port: {
          type: "number",
          description: "Port to use (default: 8080)",
          default: 8080
        },
        reverse: {
          type: "boolean",
          description: "Enable reverse tunneling (server mode)",
          default: false
        },
        remotes: {
          type: "string",
          description: "Remote forwarding spec (client mode, e.g., 'R:socks')"
        }
      },
      required: ["mode"]
    }
  }
};

// Tool execution handlers
const TOOL_HANDLERS = {
  "nuclei-scan": async (args) => {
    let cmd = `/home/youruser/go/bin/nuclei -u '${args.target}' -silent`;
    
    const severity = args.severity || "medium";
    const severityLevels = ["info", "low", "medium", "high", "critical"];
    const severityIndex = severityLevels.indexOf(severity);
    const includedSeverities = severityLevels.slice(severityIndex).join(",");
    cmd += ` -severity ${includedSeverities}`;
    
    if (args.tags) cmd += ` -tags ${args.tags}`;
    if (args.templates) cmd += ` -t ${args.templates}`;
    if (args.rateLimit) cmd += ` -rl ${args.rateLimit}`;
    
    return await execWSL(cmd, (args.timeout || 120) * 1000);
  },

  "subfinder": async (args) => {
    let cmd = `/home/youruser/go/bin/subfinder -d '${args.domain}'`;
    if (args.silent) cmd += " -silent";
    if (args.recursive) cmd += " -recursive";
    
    return await execWSL(cmd, (args.timeout || 60) * 1000);
  },

  "httpx": async (args) => {
    const targets = args.targets.replace(/,/g, '\\n');
    let cmd = `echo -e '${targets}' | /home/youruser/go/bin/httpx -silent`;
    
    if (args.statusCode) cmd += " -status-code";
    if (args.title) cmd += " -title";
    if (args.techDetect) cmd += " -tech-detect";
    if (args.webServer) cmd += " -web-server";
    if (args.followRedirects) cmd += " -follow-redirects";
    
    return await execWSL(cmd, (args.timeout || 60) * 1000);
  },

  "katana": async (args) => {
    let cmd = `/home/youruser/go/bin/katana -u '${args.url}' -silent`;
    
    if (args.depth) cmd += ` -d ${args.depth}`;
    if (args.headers) cmd += ` -H '${args.headers}'`;
    if (args.jsAnalysis) cmd += " -jc";
    if (args.formExtraction) cmd += " -ef";
    if (args.scope) cmd += ` -fs '${args.scope}'`;
    
    return await execWSL(cmd, (args.timeout || 120) * 1000);
  },

  "ffuf": async (args) => {
    const wordlistMap = {
      "common": "/usr/share/seclists/Discovery/Web-Content/common.txt",
      "api": "/usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt",
      "admin": "/usr/share/seclists/Discovery/Web-Content/admin-panels.txt",
      "backup": "/usr/share/seclists/Discovery/Web-Content/backup-files.txt",
      "raft-small": "/usr/share/seclists/Discovery/Web-Content/raft-small-words.txt",
      "raft-medium": "/usr/share/seclists/Discovery/Web-Content/raft-medium-words.txt",
      "raft-large": "/usr/share/seclists/Discovery/Web-Content/raft-large-words.txt"
    };
    
    const wordlist = wordlistMap[args.wordlist || "common"];
    let cmd = `/home/youruser/go/bin/ffuf -u '${args.url}' -w ${wordlist} -s`;
    
    if (args.matchCodes) cmd += ` -mc ${args.matchCodes}`;
    if (args.filterSize) cmd += ` -fs ${args.filterSize}`;
    if (args.threads) cmd += ` -t ${args.threads}`;
    if (args.maxTime) cmd += ` -maxtime ${args.maxTime}`;
    
    return await execWSL(cmd, (args.timeout || 360) * 1000);
  },

  "sqlmap": async (args) => {
    let cmd = `sqlmap -u '${args.url}'`;
    
    if (args.data) cmd += ` --data '${args.data}'`;
    if (args.cookie) cmd += ` --cookie '${args.cookie}'`;
    if (args.level) cmd += ` --level ${args.level}`;
    if (args.risk) cmd += ` --risk ${args.risk}`;
    if (args.dbs) cmd += " --dbs";
    if (args.tables) cmd += " --tables";
    if (args.dump) cmd += " --dump";
    if (args.batch) cmd += " --batch";
    cmd += " --random-agent";
    
    return await execWSL(cmd, (args.timeout || 300) * 1000);
  },

  "nmap": async (args) => {
    const scanPresets = {
      "quick": "-T4 -F",
      "full": "-T4 -p-",
      "udp": "-sU -T4",
      "stealth": "-sS -T2",
      "version": "-sV -T4",
      "vuln": "-sV --script vuln -T4"
    };
    
    let cmd = `nmap ${scanPresets[args.scanType || "quick"]} ${args.target}`;
    
    if (args.ports) cmd += ` -p ${args.ports}`;
    if (args.scripts) cmd += ` --script ${args.scripts}`;
    if (args.serviceDetection && !args.scanType?.includes("version")) cmd += " -sV";
    if (args.osDetection) cmd += " -O";
    
    return await execWSL(cmd, (args.timeout || 300) * 1000);
  },

  "bloodhound": async (args) => {
    let cmd = `bloodhound-python -u '${args.username}' -p '${args.password}' -d ${args.domain} -ns ${args.dcIp}`;
    
    if (args.collectionMethod) cmd += ` -c ${args.collectionMethod}`;
    if (args.outputDir) cmd += ` --zip -o '${args.outputDir}'`;
    
    return await execWSL(cmd, (args.timeout || 600) * 1000);
  },

  "crackmapexec": async (args) => {
    let cmd = `crackmapexec ${args.protocol} ${args.target} -u '${args.username}' -p '${args.password}'`;
    
    if (args.hash) cmd = `crackmapexec ${args.protocol} ${args.target} -u '${args.username}' -H '${args.hash}'`;
    if (args.shares) cmd += " --shares";
    if (args.users) cmd += " --users";
    if (args.groups) cmd += " --groups";
    if (args.command) cmd += ` -x '${args.command}'`;
    
    return await execWSL(cmd, (args.timeout || 180) * 1000);
  },

  "evil-winrm": async (args) => {
    if (!args.command) {
      return {
        success: false,
        output: "",
        error: "evil-winrm requires 'command' parameter for non-interactive use via MCP"
      };
    }
    
    let cmd = `evil-winrm -i ${args.ip} -u '${args.username}'`;
    
    if (args.password) cmd += ` -p '${args.password}'`;
    if (args.hash) cmd += ` -H '${args.hash}'`;
    if (args.command) cmd += ` -c '${args.command}'`;
    if (args.scriptFile) cmd += ` -s '${args.scriptFile}'`;
    
    return await execWSL(cmd, (args.timeout || 60) * 1000);
  },

  "whatweb": async (args) => {
    let cmd = `whatweb '${args.url}' -a ${args.aggression || 3}`;
    if (args.verbose) cmd += " --color never";
    
    return await execWSL(cmd, (args.timeout || 60) * 1000);
  },

  "chisel": async (args) => {
    if (args.mode === "server") {
      let cmd = `/home/youruser/go/bin/chisel server --port ${args.port || 8080}`;
      if (args.reverse) cmd += " --reverse";
      
      return {
        success: true,
        output: `Chisel server command (run manually in WSL):\n${cmd}`,
        error: "Note: Server mode requires manual execution and will run until stopped"
      };
    } else {
      if (!args.serverHost) {
        return {
          success: false,
          output: "",
          error: "Client mode requires 'serverHost' parameter"
        };
      }
      
      let cmd = `/home/youruser/go/bin/chisel client ${args.serverHost}:${args.port || 8080}`;
      if (args.remotes) cmd += ` ${args.remotes}`;
      
      return {
        success: true,
        output: `Chisel client command (run manually in WSL):\n${cmd}`,
        error: "Note: Client mode requires manual execution and will run until stopped"
      };
    }
  },

  "whatweb": async (args) => {
    let cmd = `whatweb '${args.url}' -a ${args.aggression || 3}`;
    if (args.verbose) cmd += " --color never";
    
    return await execWSL(cmd, (args.timeout || 60) * 1000);
  }
};

// Create MCP server
const server = new Server(
  {
    name: "wsl-security-tools",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(TOOLS).map(([name, config]) => ({
      name,
      description: config.description,
      inputSchema: config.inputSchema,
    })),
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (!TOOL_HANDLERS[name]) {
    throw new Error(`Unknown tool: ${name}`);
  }
  
  try {
    const result = await TOOL_HANDLERS[name](args);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            tool: name,
            success: result.success,
            output: result.output,
            error: result.error,
            arguments: args
          }, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            tool: name,
            success: false,
            error: error.message,
            arguments: args
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("WSL Security Tools MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
