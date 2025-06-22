import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    const options = {
      method: "GET",
      headers: {
        Token:
          "q2zS6kX7WYFRwVYArDdM66x72dR6hnZASZV7YgBSASvDNGgfYOUHNIT0cOf7kZi2lCBiLuVEikqd6Z1lazXg",
      },
    };

    const response = await fetch(
      `https://carv.ist/api.php?job=get_project&id=${projectId}&lang=en`,
      options
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Project detail API response:", JSON.stringify(data, null, 2));

    // The API returns project details nested under project_details
    let projectData = data;
    if (data.project_details) {
      projectData = data.project_details;
    }

    // Transform the API response to match our expected format
    const project = {
      id: projectData.id || data.id || projectId,
      title: projectData.title || data.title || "Untitled Project",
      client: projectData.client || data.client || "Unknown Client",
      description:
        projectData.description ||
        data.description ||
        "No description available",
      image: projectData.image || data.image || null,
      // Include any other fields from the API response
      ...projectData,
    };

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}
