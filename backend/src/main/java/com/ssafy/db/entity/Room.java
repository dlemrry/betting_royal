package com.ssafy.db.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@Data
@Builder
@DynamicUpdate
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //autoIncreament사용
    private int roomId;

    @ManyToOne //객체관계 생성 -> 한명의 유저는 여러개의 방 생성 가능
    @JoinColumn(name="hostUserId")
    private User user;

    @Column(nullable = false, length = 50)
    private String roomTitle;

    @Column(nullable = false)
    private int roomBettingUnit;

    private int roomPw;

    //roomIsStart의 default값은 false로 준다.
    private boolean roomIsStart = false;

    //roomIsClose의 default값은 false로 준다.
    private boolean roomIsClose = false;

}