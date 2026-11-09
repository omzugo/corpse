# GIVEN CODE. Serves this folder at http://localhost:8001 and lets the annotator save
# data/annotations.json (POST /save, one image's record at a time). Usage: python3 server.py
import http.server, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ANNOTATIONS = os.path.join(HERE, "data", "annotations.json")
PORT = 8001


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HERE, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")  # always serve your latest edits
        super().end_headers()

    def do_POST(self):
        if self.path != "/save":
            self.send_error(404)
            return
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        data = json.load(open(ANNOTATIONS)) if os.path.exists(ANNOTATIONS) else {}
        if body.get("record"):
            data[body["id"]] = body["record"]
        else:
            data.pop(body["id"], None)
        tmp = ANNOTATIONS + ".tmp"
        with open(tmp, "w") as f:
            json.dump(data, f, indent=1)
        os.replace(tmp, ANNOTATIONS)  # write-then-rename, so a crash can't leave a half-written file
        self.send_response(204)
        self.end_headers()


if __name__ == "__main__":
    print(f"http://localhost:{PORT}")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
