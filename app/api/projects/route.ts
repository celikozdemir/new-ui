import { NextRequest, NextResponse } from "next/server";

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  image: string | null;
  category: string;
}

export async function GET(request: NextRequest) {
  try {
    const options = {
      method: "GET",
      headers: {
        Token:
          "q2zS6kX7WYFRwVYArDdM66x72dR6hnZASZV7YgBSASvDNGgfYOUHNIT0cOf7kZi2lCBiLuVEikqd6Z1lazXg",
      },
    };

    const response = await fetch(
      "https://carv.ist/api.php?job=get_projects&lang=en",
      options
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API response:", JSON.stringify(data, null, 2));

    // The API returns a nested structure with categories
    // We need to flatten all projects from all categories
    let allProjects: Project[] = [];

    if (data.status === "success" && data.list && Array.isArray(data.list)) {
      data.list.forEach((category: any) => {
        if (category.list && Array.isArray(category.list)) {
          category.list.forEach((project: any) => {
            allProjects.push({
              id:
                project.id ||
                project.project_id ||
                Math.random().toString(36).substr(2, 9),
              title: project.title || project.name || "Untitled Project",
              client: project.client || project.client_name || "Unknown Client",
              description:
                project.description ||
                project.desc ||
                "No description available",
              image:
                project.image || project.image_url || project.thumbnail || null,
              category: category.title || "Uncategorized",
            });
          });
        }
      });
    }

    console.log("Flattened projects:", allProjects.length, "projects found");

    return NextResponse.json({ projects: allProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
