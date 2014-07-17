package wxrapp

import (
	"encoding/json"
	"github.com/frankbille/go-wxr-import"
	"io/ioutil"
	"net/http"
)

func init() {
	http.HandleFunc("/convert", func(w http.ResponseWriter, req *http.Request) {
		if req.Method != "POST" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if req.Body == nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		data, _ := ioutil.ReadAll(req.Body)

		if len(data) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		wxr := wxr.ParseWxr(data)

		jsonEncoder := json.NewEncoder(w)
		jsonEncoder.Encode(wxr)
	})
}
