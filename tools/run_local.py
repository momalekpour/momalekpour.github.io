
import http.server
import socketserver
import webbrowser
import sys
import os
from pathlib import Path

# Configuration
PORT = 8000
HOST = "localhost"

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler that doesn't print every request to console"""
    
    def log_message(self, format, *args):
        # Only log errors, not every request
        if "404" in str(args) or "500" in str(args):
            super().log_message(format, *args)

def main():
    # Change to the project root directory (parent of tools directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    os.chdir(project_root)
    
    # Create server
    handler = QuietHTTPRequestHandler
    
    try:
        with socketserver.TCPServer((HOST, PORT), handler) as httpd:
            url = f"http://{HOST}:{PORT}/index.html"
            
            print(f"🚀 Starting local development server...")
            print(f"📁 Serving files from: {project_root}")
            print(f"🌐 Your site is available at: {url}")
            print(f"⏹️  Press Ctrl+C to stop the server\n")
            
            # Try to open the browser automatically
            try:
                webbrowser.open(url)
                print(f"🔗 Opened {url} in your default browser")
            except Exception:
                print(f"💡 Manually open {url} in your browser")
            
            print(f"\n🔄 Server is running on port {PORT}...\n")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print(f"\n👋 Server stopped. Thanks for using the local dev server!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Port already in use
            print(f"❌ Port {PORT} is already in use.")
            print(f"💡 Try stopping other servers or use a different port:")
            print(f"   python3 serve.py --port 8001")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Simple port override support
    if len(sys.argv) > 2 and sys.argv[1] == "--port":
        try:
            PORT = int(sys.argv[2])
        except ValueError:
            print("❌ Invalid port number")
            sys.exit(1)
    
    main()