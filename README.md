# CS405-Project2-Lighting
This is a computer graphics project where you can add an object and a texture. Observe the interactions of them with light.

# **WebGL Project: Texture Mapping with Ambient and Specular Lighting**  

This project demonstrates the basics of texture mapping and lighting using WebGL. It includes functionalities to load a texture and apply ambient and specular lighting to a 3D object.

---

## **Features**
- **Texture Mapping**:  
  Load and apply a texture image to the 3D model.

- **Lighting Effects**:  
  - **Ambient Light**: Simulates global illumination by providing a base light level.  
  - **Specular Light**: Creates highlights based on the light's position and viewer's perspective.

---

## **Project Structure**
- **HTML**: Provides the canvas and UI for user interaction.
- **JavaScript**: Manages WebGL setup, texture loading, and shader logic.
- **Shaders**:  
  - **Vertex Shader**: Calculates positions and passes lighting data.  
  - **Fragment Shader**: Computes the final color of each pixel using texture and lighting.

---

## **Setup Instructions**

1. **Environment Setup**  
   - Access the program through the HTML file project2.html.  

2. **Load a Texture**  
   - Use the "Load Texture" button in the UI to upload a texture for the 3D object.

3. **Adjust Lighting**  
   - Modify ambient and specular lighting intensities using the provided sliders.

4. **Render**  
   - The 3D object will render with the applied texture and dynamic lighting effects.

---

