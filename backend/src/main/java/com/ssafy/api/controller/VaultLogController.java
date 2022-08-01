package com.ssafy.api.controller;

import com.ssafy.api.response.UserRes;
import com.ssafy.api.service.UserService;
import com.ssafy.api.service.UserServiceImpl;
import com.ssafy.api.service.VaultLogService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.VaultLog;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.HashMap;
import java.util.Map;

@Api(value = "금고 API", tags = {"Vault"})
@RestController
@RequestMapping("/api/vault")
public class VaultLogController {

    @Autowired
    private VaultLogService vaultLogService;

    @Autowired
    private UserService userService;

    @GetMapping("")
    @ApiOperation(value = "회원 금고 조회", notes = "아이디로 로그인한 회원의 금고 금액을 보여준다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Integer> viewVault(@ApiIgnore Authentication authentication) {
        /**
         * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
         * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
         */
        //로그인 한 user정보 찾아오는 code
        //스켈레톤 코드 UserController에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        int vault = user.getUserVault();
        return new ResponseEntity<Integer>(vault, HttpStatus.OK);
    }

    @PutMapping("/update")
    @ApiOperation(value = "회원 금고 입출금", notes = "아이디로 로그인한 회원의 금고 입출금을 해준다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Map<String, Integer>> vaultUpdate(@RequestParam int deposit, @ApiIgnore Authentication authentication) {
        /**
         * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
         * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
         */
        //로그인 한 user 정보 찾아오는 code
        //스켈레톤 코드 UserController 에서 가져옴
        SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
        String userId = userDetails.getUsername();
        User user = userService.getUserByUserEmail(userId);

        //유저의 현재 금고금액, 보유루비 바꿔준 후 유저 디비 업데이트 해줌
        user.setUserVault(user.getUserVault() + deposit);
        user.setUserRuby(user.getUserRuby() - deposit);
        /**
         * todo
         * 유저 정보에 루비랑 금고 금액 바꾸면 유저 디비 업데이트 해줄 서비스 필요함!
         */
//        userService.modifyUser(user)

        VaultLog vaultLog = VaultLog.builder()
                .user(user)
                .vaultMoneyChange(deposit)
                .vaultBalance(user.getUserRuby())
                .build();
        vaultLogService.writeVaultLog(vaultLog, user);
        Map<String, Integer> map = new HashMap<>();
        map.put("userRuby", user.getUserRuby());
        map.put("userVault", user.getUserVault());

        return new ResponseEntity<Map<String,Integer>>(map, HttpStatus.OK);
    }
}