import { getEntityIdFromToken } from '@/core/lib/jwt';

describe('getEntityIdFromToken', () => {
  it('should return EntityId = 233', () => {
    expect(
      getEntityIdFromToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbnRpdHlJZCI6MjMzLCJleHAiOjE3NDAzMTc5MzAsImlkIjoxMzQsInJvbGUiOiJwcm9kdWN0aW9uIiwidXNlcm5hbWUiOiJqZXN1cy5yZWlrZWxAeWFyZXl0ZWNoLmNvbSJ9.X_bZs_Oq47OwiZnqkH-dIy_hhDxsuvWc691XdvrcEJU',
      ),
    ).toBe(233);
  });

  it('should return EntityId = 34345', () => {
    expect(
      getEntityIdFromToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbnRpdHlJZCI6MzQzNDUsImV4cCI6MTc0NDMyNDIxNzkzMCwiaWQiOjEyMzQzMiwicm9sZSI6InByb2R1Y3Rpb24iLCJ1c2VybmFtZSI6Implc3VzQHlhcmV5dGVjaC5jb20ifQ.HouPto2paqrmoIqjz_YbC-jvN17MnaTMTVUhEz42HY4',
      ),
    ).toBe(34345);
  });

  it('should return undefined', () => {
    expect(
      getEntityIdFromToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDQzMjQyMTc5MzAsImlkIjoxMjM0MzIsInJvbGUiOiJwcm9kdWN0aW9uIiwidXNlcm5hbWUiOiJqZXN1c0B5YXJleXRlY2guY29tIn0.i-d-gD44bitH_v2Lc4qEGGGv4RpH_YXuG-U9tcIRa4o',
      ),
    ).toBe(undefined);
  });

  it('should return EntityId = 238', () => {
    expect(
      getEntityIdFromToken(
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJFbnRpdHlJZCI6MjM4LCJleHAiOjE3NDQzMjQyMTc5MzAsImlkIjoxMjM0MzIsInJvbGUiOiJwcm9kdWN0aW9uIiwidXNlcm5hbWUiOiJqZXN1c0B5YXJleXRlY2guY29tIn0.p0BdLDlUzyvgvTuYWDIeL2x8bpw8S7py3Z3I6GQiSNut1KjXPsjw6HX8AIRKvb01-5WSocdQVjKoVR40UIAhXg',
      ),
    ).toBe(238);
  });

  it('should return undefined', () => {
    expect(
      getEntityIdFromToken(
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDQzMjQyMTc5MzAsImlkIjoxMjM0MzIsInJvbGUiOiJwcm9kdWN0aW9uIn0.8liYKCh-sQ555fkjRzKzvntdugYAEUHI6T_2ooP-bgTU9wur5wMh90TMm4mVx84nFXqxX_jubQ5vgRQAsy6r0w',
      ),
    ).toBe(undefined);
  });
});
