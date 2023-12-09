"use client";
import Image from "next/image";
import Head from "next/head";
import Role from "@/models/role";

import logo from "@/assets/logos/logo.png";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";

import User from "@/models/user";
import UserController from "@/services/user/index";

import { Skeleton, Space } from "antd";
import Routes from "@/models/routes";
import useAuth from "@/hook/auth_hook";

export default function Header() {
    const { currentUser, loadingAuth } = useAuth();

    return loadingAuth ? (
        <header className="navigation">
            <Navbar bg="light" expand="lg" className="navigation-content">
                <Container>
                    <Navbar.Brand href="/">
                        <Skeleton.Image active />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Space>
                                <Skeleton.Input active />
                                <Skeleton.Input active />
                                <Skeleton.Input active />
                                <Skeleton.Input active />
                            </Space>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    ) : (
        <>
            <Head>
                <title>Welcome - Experttis</title>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                    crossOrigin="anonymous"
                />
            </Head>
            <header className="navigation">
                <Navbar bg="light" expand="lg" className="navigation-content">
                    <Container>
                        <Navbar.Brand href="/">
                            <Image
                                className="logo"
                                src={logo}
                                width={280}
                                height={94}
                                alt="Experttis logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                {!auth.currentUser &&
                                    <NavDropdown title="CLIENTS" id="basic-nav-dropdown">
                                        <NavDropdown.Item href="/#subscriptions">
                                            Subscriptions
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href={Routes.clients.login}>
                                            Sign In
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                }
                                {!auth.currentUser &&
                                    <NavDropdown title="CONSULTANTS" id="basic-nav-dropdown">
                                        <NavDropdown.Item href={Routes.consultants.register}>
                                            Registration
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href={Routes.consultants.login}>
                                            Sign In
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                }
                                <NavDropdown title="ABOUT" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/foundations">
                                        Foundations
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/#howItWorks">
                                        How It Works
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/#consultancyFields">
                                        Fields
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/#subscriptions">
                                        Plans
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/#friendly">
                                        Why
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/#asistance">
                                        Assistance
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link href="/contact-us">CONTACT US</Nav.Link>
                                {currentUser?.roles?.map(
                                    (role: Role) => role.slug
                                ).includes("consultant") &&
                                    <Nav.Link href={Routes.consultants.dashboard}>CONSULTANT AREA</Nav.Link>
                                }
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    );
}