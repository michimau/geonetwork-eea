<?xml version="1.0" encoding="UTF-8"?>
<!--
  ~ Copyright (C) 2001-2016 Food and Agriculture Organization of the
  ~ United Nations (FAO-UN), United Nations World Food Programme (WFP)
  ~ and United Nations Environment Programme (UNEP)
  ~
  ~ This program is free software; you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation; either version 2 of the License, or (at
  ~ your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful, but
  ~ WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
  ~ General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program; if not, write to the Free Software
  ~ Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
  ~
  ~ Contact: Jeroen Ticheler - FAO - Viale delle Terme di Caracalla 2,
  ~ Rome - Italy. email: geonetwork@osgeo.org
  -->

<!--
Stylesheet used to update metadata to improve INSPIRE validation regarding use and access constraints.

Restore a backup
UPDATE metadata a SET data = (SELECT data FROM metadata20181010 b WHERE a.uuid= b.uuid);
-->
<xsl:stylesheet xmlns:gmd="http://www.isotc211.org/2005/gmd"
                xmlns:gco="http://www.isotc211.org/2005/gco"
                xmlns:srv="http://www.isotc211.org/2005/srv"
                xmlns:gmx="http://www.isotc211.org/2005/gmx"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:util="java:org.fao.geonet.util.XslUtil"
                xmlns:skos="http://www.w3.org/2004/02/skos/core#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:geonet="http://www.fao.org/geonetwork"
                exclude-result-prefixes="#all"
                version="2.0">

  <xsl:output indent="yes"/>

  <xsl:variable name="uuid"
                select="//gmd:fileIdentifier/gco:CharacterString"/>

  <xsl:variable name="hasNoAccessConstraints"
                select="count(//gmd:resourceConstraints/*/gmd:accessConstraints) = 0"/>

  <xsl:variable name="hasNoLimitation"
                select="count(//gmd:otherConstraints/*[lower-case(.) = 'no limitations to public access']) > 0"/>

  <xsl:variable name="EEADataPolicy"
                select="(//gmd:resourceConstraints/*/gmd:useLimitation/gco:CharacterString)[1]"/>

  <!--<xsl:variable name="hasEEADataPolicy"
                select="count(//gco:CharacterString[contains(., 'EEA standard re-use policy')]) > 0"/>

  <xsl:variable name="isInternal"
                select="count(//gmd:identifier[contains(*/gmd:code/*/gco:CharacterString, '_i_')]) > 0"/>
-->

  <xsl:template match="gmd:resourceConstraints">
    <xsl:if test="preceding-sibling::*[1]/name() != 'gmd:resourceConstraints'">


      <xsl:choose>
        <xsl:when test="$hasNoAccessConstraints">
          <!-- Add an empty one to be filled in the editor. -->
          <gmd:resourceConstraints>
            <gmd:MD_LegalConstraints>
              <gmd:accessConstraints>
                <gmd:MD_RestrictionCode codeList="http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_RestrictionCode"
                                        codeListValue="otherRestrictions"/>
              </gmd:accessConstraints>
              <gmd:otherConstraints>
                <gmx:Anchor xlink:href=""></gmx:Anchor>
              </gmd:otherConstraints>
            </gmd:MD_LegalConstraints>
          </gmd:resourceConstraints>
        </xsl:when>
        <xsl:otherwise>
          <xsl:copy-of select="../gmd:resourceConstraints[*/gmd:accessConstraints]"/>
          <!--
          We preserve existing accessConstraints. Can be
           <gmd:resourceConstraints>
          <gmd:MD_LegalConstraints>
            <gmd:accessConstraints>
              <gmd:MD_RestrictionCode codeList="http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_RestrictionCode"
                                      codeListValue="otherRestrictions"/>
            </gmd:accessConstraints>
            <gmd:otherConstraints>
              <gmx:Anchor xlink:href="http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/noLimitations">no limitations to public access</gmx:Anchor>
            </gmd:otherConstraints>
          </gmd:MD_LegalConstraints>
        </gmd:resourceConstraints>
        for public records and something like
         <gmd:resourceConstraints>
            <gmd:MD_LegalConstraints>
               <gmd:accessConstraints>
                  <gmd:MD_RestrictionCode codeList="http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_RestrictionCode"
                                          codeListValue="otherRestrictions"/>
               </gmd:accessConstraints>
               <gmd:otherConstraints>
                  <gmx:Anchor xlink:href="http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1b">public access limited according to Article 13(1)(b) of the INSPIRE Directive</gmx:Anchor>
               </gmd:otherConstraints>
               <gmd:otherConstraints>
                  <gmx:Anchor xlink:href="http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/INSPIRE_Directive_Article13_1h">public access limited according to Article 13(1)(h) of the INSPIRE Directive</gmx:Anchor>
               </gmd:otherConstraints>
            </gmd:MD_LegalConstraints>
         </gmd:resourceConstraints>
         for more restricted ones
          -->
        </xsl:otherwise>
      </xsl:choose>


      <xsl:if test="$EEADataPolicy != ''">
        <!-- Move EEA useLimitation into a use constraints -->
        <gmd:resourceConstraints>
          <gmd:MD_LegalConstraints>
            <gmd:useConstraints>
              <gmd:MD_RestrictionCode codeList="http://standards.iso.org/iso/19139/resources/gmxCodelists.xml#MD_RestrictionCode"
                                      codeListValue="otherRestrictions"/>
            </gmd:useConstraints>
            <gmd:otherConstraints>
              <gco:CharacterString><xsl:value-of select="$EEADataPolicy"/></gco:CharacterString>
            </gmd:otherConstraints>
          </gmd:MD_LegalConstraints>
        </gmd:resourceConstraints>
      </xsl:if>
    </xsl:if>
  </xsl:template>


  <!-- Do a copy of every nodes and attributes -->
  <xsl:template match="@*|node()|comment()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()|comment()"/>
    </xsl:copy>
  </xsl:template>

  <!-- Remove geonet:* elements. -->
  <xsl:template match="geonet:*" priority="2"/>

</xsl:stylesheet>
