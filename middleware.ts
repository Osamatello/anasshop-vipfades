import {
    createServerClient,
} from "@supabase/ssr";

import {
    NextResponse,
    type NextRequest,
} from "next/server";

export async function middleware(
    request: NextRequest
) {
    let response =
        NextResponse.next({
            request,
        });

    const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const dashboardAdminEmail =
        process.env.DASHBOARD_ADMIN_EMAIL
            ?.trim()
            .toLowerCase();

    if (
        !supabaseUrl ||
        !supabaseAnonKey
    ) {
        return response;
    }

    const supabase =
        createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },

                    setAll(
                        cookiesToSet
                    ) {
                        cookiesToSet.forEach(
                            ({
                                name,
                                value,
                            }) => {
                                request.cookies.set(
                                    name,
                                    value
                                );
                            }
                        );

                        response =
                            NextResponse.next({
                                request,
                            });

                        cookiesToSet.forEach(
                            ({
                                name,
                                value,
                                options,
                            }) => {
                                response.cookies.set(
                                    name,
                                    value,
                                    options
                                );
                            }
                        );
                    },
                },
            }
        );

    const {
        data: {
            user,
        },
    } =
        await supabase.auth.getUser();

    const pathname =
        request.nextUrl.pathname;

    const isLoginPage =
        pathname ===
        "/dashboard/login";

    const isDashboardRoute =
        pathname.startsWith(
            "/dashboard"
        );

    const isAuthorizedAdmin =
        Boolean(
            user?.email &&
            dashboardAdminEmail &&
            user.email
                .trim()
                .toLowerCase() ===
            dashboardAdminEmail
        );

    if (
        isDashboardRoute &&
        !isLoginPage &&
        !user
    ) {
        const url =
            request.nextUrl.clone();

        url.pathname =
            "/dashboard/login";

        return NextResponse.redirect(
            url
        );
    }

    if (
        isDashboardRoute &&
        !isLoginPage &&
        user &&
        !isAuthorizedAdmin
    ) {
        const url =
            request.nextUrl.clone();

        url.pathname =
            "/dashboard/login";

        const redirectResponse =
            NextResponse.redirect(
                url
            );

        redirectResponse.cookies.set(
            "vipfades-unauthorized-dashboard",
            "1",
            {
                maxAge: 10,
                path: "/dashboard/login",
                sameSite: "lax",
            }
        );

        return redirectResponse;
    }

    if (
        isLoginPage &&
        isAuthorizedAdmin
    ) {
        const url =
            request.nextUrl.clone();

        url.pathname =
            "/dashboard";

        return NextResponse.redirect(
            url
        );
    }

    return response;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
    ],
};