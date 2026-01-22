/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { Code, Database, Globe, Layers, Server } from "lucide-react";

export default function ApiDocsPage() {
  const schemas = [
    {
      title: "Bus Object",
      code: `{
  "id": "string (UUID or custom ID)",
  "number": "string (Plate number/Bus ID)",
  "driver": "string",
  "route": "string (Route name)",
  "status": "string ('On Route', 'Maintenance', 'Inactive')",
  "lastUpdated": "string (ISO Date)"
}`,
    },
    {
      title: "Route Object",
      code: `{
  "id": "string",
  "name": "string",
  "busId": "string (FK to Bus)",
  "studentCount": "number",
  "stops": [
    {
      "name": "string",
      "time": "string (HH:MM AM/PM)",
      "lat": "number (Coordinate)",
      "lng": "number (Coordinate)"
    }
  ]
}`,
    },
    {
      title: "Student Object",
      code: `{
  "id": "string",
  "name": "string",
  "grade": "string",
  "busId": "string (FK to Bus)",
  "pickup": "string (Stop Name)",
  "drop": "string (Stop Name)",
  "status": "string ('Picked', 'Not Picked', 'Absent')"
}`,
    },
    {
      title: "Teacher Object",
      code: `{
  "id": "string",
  "name": "string",
  "department": "string",
  "busId": "string (FK to Bus)",
  "stop": "string (Stop Name)",
  "contact": "string"
}`,
    },
  ];

  const endpoints = [
    {
      method: "GET",
      path: "/api/buses",
      description: "Fetch all active buses",
    },
    {
      method: "GET",
      path: "/api/routes",
      description: "Fetch all route definitions",
    },
    {
      method: "GET",
      path: "/api/students",
      description: "Fetch students with assignments",
    },
    {
      method: "GET",
      path: "/api/teachers",
      description: "Fetch teachers with assignments",
    },
    {
      method: "POST",
      path: "/api/tracking/update",
      description: "Update bus live location",
    },
  ];

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto p-2">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Code size={28} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            API Documentation
          </h2>
          <p className="text-sm text-muted-foreground">
            Backend integration guide for School Fleet Management System
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Endpoints */}
        <div className="glass p-2 rounded-3xl border border-border space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Server size={18} />
            <h3 className="font-bold uppercase tracking-widest text-xs">
              Required Endpoints
            </h3>
          </div>
          <div className="space-y-3">
            {endpoints.map((ep, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-accent/20 border border-border/50 group hover:border-primary/30 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] font-black px-2 py-1 rounded-md ${
                      ep.method === "GET"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="text-xs font-mono text-foreground">
                    {ep.path}
                  </code>
                </div>
                <p className="text-[10px] text-muted-foreground italic font-medium">
                  {ep.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Logic */}
        <div className="glass p-2 rounded-3xl border border-border space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Globe size={18} />
            <h3 className="font-bold uppercase tracking-widest text-xs">
              Tracking Logic (OSRM)
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 text-slate-300 text-xs font-mono leading-relaxed border border-border/50">
            <p className="text-primary mb-4">
              // How Frontend handles Road Tracking
            </p>
            <p>Fetch OSRM Route:</p>
            <p className="text-emerald-500">
              https://router.project-osrm.org/route/v1/driving/
            </p>
            <p className="text-white mt-2">{`{lng1,lat1};{lng2,lat2};...`}</p>
            <p className="mt-4 text-primary">// Notes:</p>
            <ul className="list-disc ml-4 space-y-1 mt-1">
              <li>Backend should store stops as lat/lng.</li>
              <li>Frontend interpolates points for animation.</li>
              <li>Live coords should be pushed via WebSockets (planned).</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <Database size={18} />
          <h3 className="font-bold uppercase tracking-widest text-xs">
            Data Structures
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {schemas.map((schema, i) => (
            <div
              key={i}
              className="glass p-3 rounded-2xl border border-border flex flex-col space-y-3 group hover:border-primary/50 transition-all"
            >
              <h4 className="text-sm font-bold text-foreground flex items-center">
                <Layers size={14} className="mr-2 text-primary" />
                {schema.title}
              </h4>
              <div className="relative">
                <pre className="p-3 bg-accent/20 rounded-xl text-[10px] font-mono overflow-x-auto text-muted-foreground group-hover:text-foreground transition-colors">
                  {schema.code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
