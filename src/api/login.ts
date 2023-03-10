import { BASE_URL } from "./const";
import {
  getAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
} from "../utils/accessTokenHandler";
import { UserInfo } from "../types/user";

type LoginResult = "success" | "fail";

export type LoginResultWithToken =
  | {
      result: "success";
      access_token: string;
    }
  | {
      result: "fail";
      access_token: null;
    };

export interface LoginRequest {
  username: string;
  password: string;
}

/*********
 *  실습 2-1
 * */

export const loginWithToken = async (
  args: LoginRequest
): Promise<LoginResultWithToken> => {
  // TODO(2-1): 로그인 API 호출 및 토큰 반환하기

  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (loginRes.ok) {
    const loginResponseData = await loginRes.json();
    return { result: "success", access_token: loginResponseData.access_token };
  }
  return {
    result: "fail",
    access_token: null,
  };
};

export const getCurrentUserInfoWithToken = async (
  token: string
): Promise<UserInfo | null> => {
  // TODO(2-1): 함수에서 토큰을 직접 주입받아 사용하기

  let getCurrentUserRes = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (getCurrentUserRes.ok) {
    return getCurrentUserRes.json() as Promise<UserInfo>;
  }

  return null;
};

/*********
 *  실습 2-2
 * */

export const login = async (args: LoginRequest): Promise<LoginResult> => {
  // TODO(2-2): 로그인 API 호출 및 access token 로컬스토리지에 저장하기
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (loginRes.ok) {
    const loginResponseData = await loginRes.json();
    saveAccessTokenToLocalStorage(loginResponseData.access_token);
    return "success";
  }

  return "fail";
};

export const getCurrentUserInfo = async (): Promise<UserInfo | null> => {
  // TODO(2-2): 로컬스토리지에서 토큰을 가져와 사용하기
  let token = getAccessTokenFromLocalStorage();

  let getCurrentUserRes = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (getCurrentUserRes.ok) {
    return getCurrentUserRes.json() as Promise<UserInfo>;
  }

  return null;
};
