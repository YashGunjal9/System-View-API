const http = require('http');
const os = require('os');
const process = require('process');
const url = require('url');

//! Format bytes to human readable format

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    // set base unit
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

//! Format seconds to human readable format

function formatTime(seconds) { 
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}

// console.log(os.cpus()[0]);

// Get the system CPU information

const getCPUInfo = () => {
    const model = os.cpus()[0].model;
    const cores = os.cpus().length;
    const architecture = os.arch();
    const loading = os.loadavg();

    return {
        model,
        cores,
        architecture,
        loading
    }

    console.log({model, cores, architecture, loading});
}

// console.log(getCPUInfo());

// Get the system memory information

const getMemoryInfo = () => {
    const total = formatBytes(os.totalmem());
    const free = formatBytes(os.freemem());
    const usage = ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2) + '%';
    return {
        total,
        free,
        usage
    };
};

getMemoryInfo()

// Get the system OS information

const getOSInfo = () => {
    const platform = os.platform();
    const type = os.type();
    const release = os.release();
    const hostname = os.hostname();
    const uptime = formatTime(os.uptime());
    return {
        platform,
        type,
        release,
        hostname,
        uptime
    }
};

// getOSInfo()

// Get the system User information

const getUserInfo = () => {
    const user = os.userInfo();
    return user;
};

getUserInfo();

// Get the system network information

const getNetworkInfo = () => {
    const network = os.networkInterfaces();
    console.log(network);
    return network;
};

// getNetworkInfo();

// Get the system Process information

const getProcessInfo = () => {
    const pid = process.pid;
    const title = process.title;
    const nodeVersion = process.version;
    const uptime = formatTime(process.uptime());
    console.log({ pid, title, nodeVersion });
    cwd: process.cwd();
    return {
        pid, title, nodeVersion, uptime,        
        memoryUsage: {
        rss: formatBytes(process.memoryUsage().rss),
        heapTotal: formatBytes(process.memoryUsage().heapTotal),
        heapUsed: formatBytes(process.memoryUsage().heapUsed),
        externals: formatBytes(process.memoryUsage().external),
    },
    env: {
        NODE_ENV: process.env.NODE_ENV || "Not Set",
    }       
    }
};

// getProcessInfo();

//! HTTP Server

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');
    if (parsedUrl.pathname === "/") {
        res.statusCode = 200;
        res.end(
            JSON.stringify({
                name: "System View API",
                version: "1.0.0",
                description: "A simple system view API",
                routes: ["/cpu", "/memory", "/os", "/user", "/network", "/process"],
            }),
        );
    } else if (parsedUrl.pathname === "/cpu") {
        res.end(JSON.stringify(getCPUInfo(), null, 2));
    } else if (parsedUrl.pathname === "/memory") {
        res.end(JSON.stringify(getMemoryInfo(), null, 2));
    } else if (parsedUrl.pathname === "/os") {
        res.end(JSON.stringify(getOSInfo(), null, 2));
    } else if (parsedUrl.pathname === "/user") {
        res.end(JSON.stringify(getUserInfo(), null, 2));
    } else if (parsedUrl.pathname === "/network") {
        res.end(JSON.stringify(getNetworkInfo(), null, 2));
    } else if (parsedUrl.pathname === "/process") {
        res.end(JSON.stringify(getProcessInfo(), null, 2));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});

//! Start the HTTP server

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

