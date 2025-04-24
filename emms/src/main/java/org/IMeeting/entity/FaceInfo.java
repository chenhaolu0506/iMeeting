package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "u_face")
public class FaceInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer userId;
    private String faceAddress;
    private byte[] faceDetail;
    private Integer status;
    private Integer tenantId;
    private String lastTime;
}
