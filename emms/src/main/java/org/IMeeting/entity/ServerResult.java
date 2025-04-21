package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServerResult {
    // true if success, false if fail
    private boolean status;

    // status code
    private Integer code;

    // message
    private String message;

    // data
    private Object data;

    public ServerResult() {
        this.status = false;
        this.code = 0;
        this.message = null;
        this.data = null;
    }

    public static ServerResult failWithMessage(String message) {
        ServerResult serverResult = new ServerResult();
        serverResult.message = message;
        return serverResult;
    }
}
