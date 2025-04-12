package org.example.controller;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Resp {
    Integer code;
    String content;

    static Resp newInstance(Integer code, String content) {
        Resp resp = new Resp();
        resp.code = code;
        resp.content = content;
        return resp;
    }
}
