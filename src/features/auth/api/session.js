// Maps the backend's AuthResponseDto to what the auth store expects
export const toSession = (d) =>
  d?.token
    ? {
        accessToken: d.token,
        user: {
          id: d.userId,
          email: d.email,
          firstName: d.firstName,
          lastName: d.lastName,
          fullName: `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim(),
          phoneNumber: d.phoneNumber,
          profilePictureUrl: d.profilePictureUrl,
        },
      }
    : null