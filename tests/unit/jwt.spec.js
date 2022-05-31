import { getParsedJwtBody } from '@/utils/jwt'

const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVc2VySW5mbyIsImN1c3RJZCI6IkxHX0FETUlOIiwic3ZjQ2QiOiJBTEwiLCJ1c2VySWQiOiJTVVBFUkFETUlOIiwidXNlck5hbWUiOiLqs7XthrXqtIDrpqzsnpAiLCJjdXN0U2VxIjoiMCIsInVzZXJTZXEiOiIwIiwib3JnU2VxIjoiMSIsIm9yZ05tIjoi7JWg67KE7Luk7IqkIiwicm9sZUNkSWQiOiJDMDAxMTkxIiwicm9sZUNkTm0iOiLqs7XthrXqtIDrpqzsnpAiLCJleHAiOjE1NjIxNDA3MzB9.W6BQX1TTZf7WMLaAyHF7iqarJhqGD0nG-wu7ZrDO8LI'
const parsedJwtTokenBody = {
  sub: 'UserInfo',
  custId: 'LG_ADMIN',
  svcCd: 'ALL',
  userId: 'SUPERADMIN',
  userName: '공통관리자',
  custSeq: '0',
  userSeq: '0',
  orgSeq: '1',
  orgNm: '애버커스',
  roleCdId: 'GN00000038',
  roleCdNm: '공통관리자',
  exp: 1562140730
}

describe('Test_JWT_Util', () => {
  it('getParsedJwtBody - Normal JWT TOKEN', () => {
    let jwtBody = getParsedJwtBody(jwtToken)
    expect(jwtBody).toEqual(parsedJwtTokenBody)
    expect(jwtBody.roleCdId).toEqual('GN00000038')
  })
  it('getParsedJwtBody - Not Include Attribute', () => {
    let jwtBody = getParsedJwtBody(jwtToken)
    expect(jwtBody.aaa).toEqual(undefined)
    expect(!jwtBody.aaa).toEqual(true)
  })
  it('getParsedJwtBody - Empty Param', () => {
    let jwtBody = getParsedJwtBody()
    expect(jwtBody).toEqual({})
    expect(jwtBody.aaa).toEqual(undefined)
    expect(!jwtBody.aaa).toEqual(true)
  })
  it('getParsedJwtBody - Wrong JWT TOKEN', () => {
    let jwtBody = getParsedJwtBody('.eyJzdWIiOiJVc2VySW5mbyIsImN1c3RJZCI6I')
    expect(jwtBody).toEqual({})
    expect(jwtBody.aaa).toEqual(undefined)
    expect(!jwtBody.aaa).toEqual(true)
  })
})
