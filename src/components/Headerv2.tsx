'use client'

import Image from "next/image";
import Link from "next/link";
import links from "@/static/navLinks";

import { useState } from 'react';

/* --------- Assets --------- */
import logo from '@/assets/logos/logo.png'

function Header() {
    const [linkIndex, setLinkIndex] = useState<number>();
    const [dropDown, setDropDown] = useState<boolean>(false);

    const handleDropdown = (index: number) => {
        if (dropDown === true && linkIndex === index) {
            setDropDown(false)
            setLinkIndex(undefined)
        } else {
            setDropDown(true)
        }
        setLinkIndex(index)
    }

    return (
        <header className="flex items-center justify-between bg-gray-100 h-32 px-32 max-w-[1440px] m-auto">
            <Link href={'/'}>
                <Image
                    src={logo}
                    alt="Logo"
                    width={260}
                    height={200}
                />
            </Link>

            <nav>
                <ul className="flex gap-4">
                    {
                        links.map((l, index) => {
                            return (
                                <li
                                    onClick={() => handleDropdown(index)}
                                    className="relative"
                                    key={l.title + index}
                                >
                                    <Link className="text-xl hover:text-bluePrimary uppercase font-semibold transition-colors decoration-slice" href={l.route}>
                                        {l.title}
                                    </Link>

                                    {
                                        linkIndex === index && dropDown &&
                                        <div
                                            onMouseLeave={() => {
                                                setTimeout(() => {
                                                    setDropDown(false)
                                                }, 500)
                                            }}
                                            className="absolute top-14 bg-gray-100 shadow-sm py-2 px-4 rounded-md text-base flex flex-col flex-wrap"
                                        >
                                            {
                                                l?.sublinks?.map((sl, index) => {
                                                    return (
                                                        <Link className="mb-2 hover:text-bluePrimary transition-colors text-lg font-medium" key={sl.title + index} href={sl.route}>
                                                            {sl.title}
                                                        </Link>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        </header>
    );
}

export default Header;