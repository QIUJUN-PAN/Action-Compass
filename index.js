const startButton =
    document.getElementById("start-button");

startButton.addEventListener("click", function()
{
    const savedTasks =
        localStorage.getItem("stopScrollingTasks");

    let tasks = {};

    if (savedTasks !== null)
    {
        tasks = JSON.parse(savedTasks);
    }

    const hasTasks =
        Object.keys(tasks).length > 0;

    if (hasTasks)
    {
        window.location.href = "homepage.html";
    }
    else
    {
        window.location.href = "manage.html";
    }
});