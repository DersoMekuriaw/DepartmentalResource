"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "antd";
import { defaultAppSetting } from "../app/config/app.config";

export default function Navbar() {
  const [role, setRole] = useState("department-head");
  const menuBarItems = defaultAppSetting?.roles.filter((role) => role.key === "department-head");
  const selectedRole = menuBarItems.map((menu) => menu.name).flat();
  const menuItems = menuBarItems.map((menus) => menus.menu).flat();
  return (
    <nav className="bg-blue-400 text-white p-4 flex justify-between">
          <h1 className="text-xl font-bold">{selectedRole}</h1>
          <div className="space-x-4">
            {menuItems.map((item) => (
              <Link href={item.url} key={item?.name}>{item.name}</Link>
            ))}
          </div>  
    </nav>
  );
}
  {/* <Link href="/">Home</Link>
        {role === "instructor" && 
        <>
            <Link href="/add-resource">Add Resource</Link>
            <Link href="/review">Review Resource</Link>
        </>
        }
        {role === "student" && <Link href="/resources">View Resource</Link>}
        {role === "department_head" && <Link href="/assign-reviewer">Assign Reviewer</Link>}
        <Button onClick={() => setRole(role === "student" ? "instructor" : "student")}>
          Switch to {role === "student" ? "Instructor" : "Student"}
        </Button> */}
      {/* </div> */}