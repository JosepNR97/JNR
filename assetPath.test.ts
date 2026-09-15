import { assetPath } from './assetPath';

describe('assetPath', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it.each([
    ['/ca/', '/assets/credential-issuers/aws.svg'],
    ['/es/', '/assets/credential-issuers/aws.svg'],
    ['/en/', '/assets/credential-issuers/aws.svg'],
    ['/JNR/ca/', '/JNR/assets/credential-issuers/aws.svg'],
    ['/JNR/es/', '/JNR/assets/credential-issuers/aws.svg'],
    ['/JNR/en/', '/JNR/assets/credential-issuers/aws.svg'],
  ])(
    'resolves public assets outside the locale directory for %s',
    (pathname, expectedPathname) => {
      window.history.replaceState({}, '', pathname);

      const resolvedUrl = new URL(
        assetPath('credential-issuers/aws.svg'),
        window.location.href,
      );

      expect(resolvedUrl.pathname).toBe(expectedPathname);
    },
  );
});
